# Auto Check-In System

Auto Check-In 是一款自動化打卡系統，允許使用者透過網頁輸入資訊到資料庫，並透過腳本進行打卡。此系統旨在簡化日常打卡流程，提升資料記錄的準確性與效率。

## 注意事項
- 本系統僅支持特定的打卡網站(某糖打卡系統)。在使用前，請確保您的打卡系統與本系統相容。
- 使用本系統進行自動打卡可能違反您的雇主規則或當地法律。使用前請仔細評估相關風險。

## 免責聲明
- 本系統僅供學術和研究目的使用。開發者不鼓勵也不支持任何形式的違反勞動規範或法律的行為。
- 本系統的開發者不對因使用或濫用本系統而產生的任何直接或間接後果負責。
- 使用者應自行承擔使用本系統所帶來的所有風險。建議在使用前諮詢相關法律意見。
- 請注意，使用 Auto Check-In 自動打卡系統時，您應自行負責遵守您所使用的第三方服務或網站的使用條款與法律規範。開發者不對任何因違反使用條款或法律產生的後果承擔責任。使用本系統前，請確保您完全理解並接受這些風險。

## 特點
- 自動化打卡：使用者可以自動記錄打卡時間，無需手動輸入。
- 網頁：提供簡潔直觀的網頁，方便使用者輸入及查看資料。
- 資料庫整合：系統與資料庫緊密整合，確保資料的安全儲存與快速存取。

## 技術

- **前端：**
  - React Ts
  - Material-UI

- **後端：**
  - Python
  - Selenium
  - FastAPI

- **資料庫：**
  - Mongodb

- **其他工具：**
  - Docker
  - Aws EC2
  - Nginx
  - Git
  - Github Action

## 安裝教學

此項目需要在 Linux 系統中安裝和運行。請按照以下步驟進行安裝：

### 前置要求
- 必須是 Linux 系統。
- 需安裝Docker、Node.js、npm( setup.sh 會在linux系統中安裝好docker，其餘兩個需要自行安裝)。

### Step1：下載檔案
```bash
  git clone https://github.com/bohan1109/auto_check_in.git
```
### Step2：設定環境變數
1. 將前端和後端目錄中的 .env.example 檔案複製並重新命名為 .env。
2. 在 .env 檔案中填入必要的環境變數設定。

### Step3：安裝前端依賴、建立靜態檔案
1. 在前端目錄下運行以下指令
```bash
#進入前端目錄
cd auto_check_in/application_server
#執行以下指令安裝前端依賴
npm install
```
2. 建立前端靜態檔案
```bash
npm run build
```
### Step4：配置、運行後端
進入後端目錄
```bash
cd auto_check_in/api_server
```
1. 運行 setup.sh 以設置後端環境。
2. 進入 Docker 環境並運行 key_manager.py 生成加密密鑰。
```bash
#使用以下指令找到 python container
docker ps
#使用以下指令進入docker環境內
docker exec -it [container name] /bin/sh
#使用以下指令進入container後端資料夾
cd /usr/src/backend/
#運行key_manager.py
python key_manager.py
```
3. 在後端目錄中創建一個 AES_config.py 檔案，並設定 AES_KEY 為 key_manager.py 生成的密鑰，範例如下。
```python
#AES_config.py
AES_KEY = b'SWKQc1xRzNpN2LfmKOsyyIdNvU_3V-a1zBuGzcJ-ooo='
```
1. 運行docker ps，查看 python 的 container name，並將 setup.sh 內的crontab指令中 api_server_web_1 改為container name
2. 重新運行setup.sh

### Step5：配置Nginx
配置 Nginx 以便正確地代理請求到您的應用程式。
配置須包含前端、後端。

### 初始登入系統
系統初始登錄的帳號和密碼均設為 admin。