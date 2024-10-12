package main

import (
	"context"
	"fmt"
	"io/fs"
	"os"
	"os/exec"
	stdruntime "runtime"
	"time"

	"github.com/google/uuid"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
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

	fmt.Println(files)

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
