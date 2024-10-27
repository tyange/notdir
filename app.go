package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io/fs"
	"log"
	"os"
	"os/exec"
	stdruntime "runtime"
	"time"

	"github.com/google/uuid"
	_ "github.com/mattn/go-sqlite3"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
	db  *sql.DB
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// 데이터베이스 초기화
	err := a.initDatabase()
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
}

// initDatabase initializes the SQLite database
func (a *App) initDatabase() error {
	// 데이터베이스 파일 경로 설정
	dbPath := "./data.db"

	// 데이터베이스 파일 존재 여부 확인
	dbExists := fileExists(dbPath)

	// 데이터베이스 연결
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return fmt.Errorf("failed to open database: %v", err)
	}
	a.db = db

	// 데이터베이스 연결 테스트
	err = db.Ping()
	if err != nil {
		return fmt.Errorf("failed to ping database: %v", err)
	}

	if !dbExists {
		// 새로운 데이터베이스인 경우 테이블 생성
		err = a.createTables()
		if err != nil {
			return fmt.Errorf("failed to create tables: %v", err)
		}
		log.Println("Created new database tables")
	} else {
		// 기존 데이터베이스의 구조 검증
		err = a.validateTables()
		if err != nil {
			return fmt.Errorf("failed to validate tables: %v", err)
		}
		log.Println("Validated existing database tables")
	}

	return nil
}

// fileExists checks if a file exists
func fileExists(filename string) bool {
	_, err := os.Stat(filename)
	return !os.IsNotExist(err)
}

// validateTables checks if all required tables exist
func (a *App) validateTables() error {
	requiredTables := []string{"notdir", "atomdir", "file_info"}

	for _, table := range requiredTables {
		var name string
		err := a.db.QueryRow(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name=?
        `, table).Scan(&name)

		if err == sql.ErrNoRows {
			// 테이블이 없는 경우 생성
			err = a.createTables()
			if err != nil {
				return fmt.Errorf("failed to create missing tables: %v", err)
			}
			return nil
		} else if err != nil {
			return fmt.Errorf("failed to check table %s: %v", table, err)
		}
	}

	return nil
}

// createTables creates all required database tables
func (a *App) createTables() error {
	queries := []string{
		// FileInfo 테이블
		`CREATE TABLE IF NOT EXISTS file_info (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            size INTEGER NOT NULL,
            mode INTEGER NOT NULL,
            mod_time DATETIME NOT NULL,
            is_dir BOOLEAN NOT NULL,
            path TEXT NOT NULL,
            parent_atomdir_id TEXT,
            parent_notdir_id TEXT,
            FOREIGN KEY (parent_atomdir_id) REFERENCES atomdir(id) ON DELETE CASCADE,
            FOREIGN KEY (parent_notdir_id) REFERENCES notdir(id) ON DELETE CASCADE
        );`,

		// Atomdir 테이블
		`CREATE TABLE IF NOT EXISTS atomdir (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            parent_notdir_id TEXT NOT NULL,
            FOREIGN KEY (parent_notdir_id) REFERENCES notdir(id) ON DELETE CASCADE
        );`,

		// Notdir 테이블
		`CREATE TABLE IF NOT EXISTS notdir (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            path TEXT NOT NULL
        );`,
	}

	// 트랜잭션 시작
	tx, err := a.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %v", err)
	}
	defer tx.Rollback()

	// 각 테이블 생성 쿼리 실행
	for _, query := range queries {
		_, err := tx.Exec(query)
		if err != nil {
			return fmt.Errorf("failed to execute query: %v", err)
		}
	}

	// 트랜잭션 커밋
	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("failed to commit transaction: %v", err)
	}

	return nil
}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {
	// 데이터베이스 연결 종료
	if a.db != nil {
		a.db.Close()
	}
}

func (a *App) ShowMessageDialog(options runtime.MessageDialogOptions) (*string, error) {
	selection, err := runtime.MessageDialog(a.ctx, options)
	if err != nil {
		return nil, fmt.Errorf("MessageDialog 선택 중 오류 발생: %v", err)
	}

	return &selection, nil
}

type FileInfo struct {
	Id      string
	Name    string
	Size    int64
	Mode    fs.FileMode
	ModTime time.Time
	IsDir   bool
	Path    string
}

func (a *App) MultiSelection() ([]FileInfo, error) {
	paths, err := runtime.OpenMultipleFilesDialog(a.ctx, runtime.OpenDialogOptions{})
	if err != nil {
		return nil, fmt.Errorf("멀티 파일 선택 중 오류 발생: %v", err)
	}

	var files []FileInfo
	for _, value := range paths {
		fileInfo, err := os.Stat(value)

		if err != nil {
			return nil, fmt.Errorf("멀티 파일 정보 읽는 중 오류 발생: %v", err)
		}

		customInfo := FileInfo{
			Id:      uuid.NewString(),
			Name:    fileInfo.Name(),
			Size:    fileInfo.Size(),
			Mode:    fileInfo.Mode(),
			ModTime: fileInfo.ModTime(),
			IsDir:   fileInfo.IsDir(),
			Path:    value,
		}
		files = append(files, customInfo)
	}

	return files, nil
}

func (a *App) FileOpen(filePath string) error {
	var cmd = exec.Command("open", filePath)

	switch stdruntime.GOOS {
	case "darwin": // macOS
		cmd = exec.Command("open", filePath)
	case "windows":
		cmd = exec.Command("cmd", "/c", "start", "", filePath)
	case "linux":
		cmd = exec.Command("xdg-open", filePath)
	default:
		return fmt.Errorf("지원하지 않는 운영 체제입니다: %s", stdruntime.GOOS)

	}

	// 명령을 실행합니다.
	err := cmd.Start()

	return err
}

type Atomdir struct {
	Id    string
	Name  string
	Files []FileInfo
}

type Notdir struct {
	Id       string
	Name     string
	Atomdirs []Atomdir
	Files    []FileInfo
	Path     string
}

func (a *App) FileSave(notdir Notdir) error {
	jsonData, err := json.Marshal(notdir)
	if err != nil {
		fmt.Println("JSON 변환 중 오류 발생: ", err)
		return err
	}

	err = os.WriteFile(notdir.Path, jsonData, 0644)
	if err != nil {
		fmt.Println("파일 저장 중 오류 발생:", err)
		return err
	}

	return nil
}

func (a *App) FileSaveWithDialog(notdir Notdir) error {
	// 파일 저장 다이얼로그 열기
	filePath, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		DefaultFilename: fmt.Sprintf("%s.notdir", notdir.Name), // 기본 파일명 설정
		Title:           "Notdir 파일 저장",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Notdir Files (*.notdir)",
				Pattern:     "*.notdir",
			},
			{
				DisplayName: "All Files (*.*)",
				Pattern:     "*.*",
			},
		},
	})

	if err != nil {
		fmt.Println("파일 다이얼로그 오류:", err)
		return err
	}

	// 사용자가 취소한 경우
	if filePath == "" {
		return nil
	}

	// filePath를 notdir에 등록
	notdir.Path = filePath

	// JSON 데이터로 변환
	jsonData, err := json.Marshal(notdir)
	if err != nil {
		fmt.Println("JSON 변환 중 오류 발생: ", err)
		return err
	}

	// 선택한 위치에 파일 저장
	err = os.WriteFile(filePath, jsonData, 0644)
	if err != nil {
		fmt.Println("파일 저장 중 오류 발생:", err)
		return err
	}

	return nil
}

func (a *App) NotdirFileOpen() (*Notdir, error) {
	path, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{})
	if err != nil {
		return nil, fmt.Errorf("파일 선택 중 오류 발생: %v", err)
	}

	content, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("파일 읽기 오류 발생: %v", err)
	}

	var notdir Notdir

	err = json.Unmarshal(content, &notdir)
	if err != nil {
		return nil, fmt.Errorf("JSON 파싱 오류 발생: %v", err)
	}

	return &notdir, nil
}

func (a *App) FileExists(path string) bool {
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		return false
	}

	return err == nil
}
