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
	"path/filepath"
	stdruntime "runtime"
	"time"

	"github.com/google/uuid"
	_ "github.com/mattn/go-sqlite3"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx    context.Context
	db     *sql.DB
	dbPath string
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
		a.ShowMessageDialog(runtime.MessageDialogOptions{Message: fmt.Sprint(err), Type: runtime.ErrorDialog})
	}
}

// getAppDataPath returns the appropriate directory for application data
func getAppDataPath() (string, error) {
	// 사용자의 홈 디렉토리 가져오기
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("failed to get home directory: %v", err)
	}

	// 애플리케이션 데이터 디렉토리 경로 생성
	// Windows: %USERPROFILE%\AppData\Local\YourAppName
	// macOS: ~/Library/Application Support/YourAppName
	// Linux: ~/.local/share/YourAppName
	var appDataDir string
	switch os.Getenv("GOOS") {
	case "windows":
		appDataDir = filepath.Join(homeDir, "AppData", "Local", "notdir")
	case "darwin":
		appDataDir = filepath.Join(homeDir, "Library", "Application Support", "notdir")
	default: // linux 및 기타
		appDataDir = filepath.Join(homeDir, ".local", "share", "notdir")
	}

	return appDataDir, nil
}

// initDatabase initializes the SQLite database
func (a *App) initDatabase() error {
	// 애플리케이션 데이터 디렉토리 가져오기
	appDataDir, err := getAppDataPath()
	if err != nil {
		return fmt.Errorf("failed to get app data path: %v", err)
	}

	// 데이터베이스 파일 경로 설정
	a.dbPath = filepath.Join(appDataDir, "data.db")
	log.Printf("Database path: %s", a.dbPath)

	// 데이터베이스 파일 존재 여부 확인
	dbExists := a.FileExists(a.dbPath)

	if !dbExists {
		dbDir := filepath.Dir(a.dbPath)
		err = os.MkdirAll(dbDir, 0755)
		if err != nil {
			return fmt.Errorf("failed to create database directory: %v", err)
		}

		// 빈 파일 생성
		file, err := os.Create(a.dbPath)
		if err != nil {
			return fmt.Errorf("failed to create database file: %v", err)
		}
		file.Close()
	}

	// 데이터베이스 연결
	db, err := sql.Open("sqlite3", a.dbPath)
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

// validateTables checks if all required tables exist
func (a *App) validateTables() error {
	requiredTables := []string{"notdir"}

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
	query :=
		`CREATE TABLE IF NOT EXISTS notdir (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            path TEXT NOT NULL
        );`

	// 트랜잭션 시작
	tx, err := a.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %v", err)
	}
	defer tx.Rollback()

	// 테이블 생성 쿼리 실행
	_, err = tx.Exec(query)
	if err != nil {
		return fmt.Errorf("failed to execute query: %v", err)
	}

	// 트랜잭션 커밋
	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("failed to commit transaction: %v", err)
	}

	return nil
}

type NotdirBase struct {
	Id   string `db:"id"`
	Name string `db:"name"`
	Path string `db:"path"`
}

func (a *App) GetInitialData() ([]*NotdirBase, error) {
	query := `
        SELECT id, name, path
        FROM notdir
    `

	rows, err := a.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %v", err)
	}
	defer rows.Close()

	var results []*NotdirBase
	for rows.Next() {
		item := &NotdirBase{}
		if err := rows.Scan(&item.Id, &item.Name, &item.Path); err != nil {
			return nil, fmt.Errorf("failed to scan row: %v", err)
		}
		results = append(results, item)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %v", err)
	}

	return results, nil
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

func (a *App) RunFile(filePath string) error {
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

// NotdirFileOpen opens a Notdir JSON file and updates the database
func (a *App) NotdirFileOpen(givenPath *string) (*Notdir, error) {

	var path string
	if givenPath == nil || *givenPath == "" {
		var err error
		path, err = runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{})
		if err != nil {
			return nil, fmt.Errorf("파일 선택 중 오류 발생: %v", err)
		}
	} else {
		path = *givenPath
	}

	// 파일 읽기
	content, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("파일 읽기 오류 발생: %v", err)
	}

	// JSON 파싱
	var notdir Notdir
	err = json.Unmarshal(content, &notdir)
	if err != nil {
		return nil, fmt.Errorf("JSON 파싱 오류 발생: %v", err)
	}

	// 데이터베이스 업데이트
	err = a.SaveNotdirToDb(&notdir)
	if err != nil {
		return nil, fmt.Errorf("데이터베이스 저장 중 오류 발생: %v", err)
	}

	return &notdir, nil
}

// SaveNotdirToDb saves a Notdir structure to the database using a transaction
func (a *App) SaveNotdirToDb(notdir *Notdir) error {
	// 트랜잭션 시작
	tx, err := a.db.Begin()
	if err != nil {
		return fmt.Errorf("트랜잭션 시작 오류: %v", err)
	}
	defer tx.Rollback() // 오류 발생 시 롤백

	// Notdir 정보 저장/업데이트
	_, err = tx.Exec(`
        INSERT OR REPLACE INTO notdir (id, name, path)
        VALUES (?, ?, ?)
    `, notdir.Id, notdir.Name, notdir.Path)
	if err != nil {
		return fmt.Errorf("notdir 저장 오류: %v", err)
	}

	// 트랜잭션 커밋
	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("트랜잭션 커밋 오류: %v", err)
	}

	return nil
}

func (a *App) FileExists(path string) bool {
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		return false
	}

	return err == nil
}
