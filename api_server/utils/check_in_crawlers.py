from selenium.common.exceptions import NoSuchElementException
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from config import CrawlerConfig
from selenium.common.exceptions import TimeoutException
from models.check_in_accounts import CheckInAccountCreate
import time

class CheckInCrawler:
    def __init__(self) -> None:
        self.driver = webdriver.Chrome()
    def check_in(self) -> bool:
        try:
            self.driver.get(CrawlerConfig.CRAWLER_WEBSITE)
            account_text_input = self.driver.find_element(By.ID, 'id')
            account_text_input.send_keys(CrawlerConfig.UID)

            password_text_input = self.driver.find_element(By.ID, 'pw')
            password_text_input.send_keys(CrawlerConfig.PASSWORD)

            login_button = self.driver.find_element(By.ID, 'button')
            login_button.click()

            clock_in_button = self.driver.find_element(By.CSS_SELECTOR, 'div[data-key="1"]')
            clock_in_button.click()

            # 等待打卡成功的指標元素出現
            WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, 'success')))
            
            # 若成功等待到元素，則回傳True
            return True
            
        except TimeoutException:
            # 若發生TimeoutException異常，表示指定元素未在預期時間內出現，則回傳False
            return False

    
    def login_result(self,check_in_account:CheckInAccountCreate):
        try:
            print(check_in_account)
            self.driver.get(CrawlerConfig.CRAWLER_WEBSITE)
            account_text_input = self.driver.find_element(By.ID, 'id')
            account_text_input.send_keys(check_in_account.check_in_account)

            password_text_input = self.driver.find_element(By.ID, 'pw')
            password_text_input.send_keys(check_in_account.check_in_password)

            login_button = self.driver.find_element(By.ID, 'button')
            login_button.click()
            time.sleep(1)
            error_message = self.driver.find_element(By.ID, 'msg').text
            print(f"error_message: {error_message}")
            if "帳號密碼錯誤" in error_message:
                return False

            # 等待登入成功的指標元素出現
            WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'div[data-key="1"]')))
            
            # 若成功等待到元素，則回傳True
            return True
            
        except TimeoutException:
            # 若發生TimeoutException異常，表示指定元素未在預期時間內出現，則回傳False
            return False
        except NoSuchElementException:
            return True

        except Exception as e:
            print(f"Unexpected error: {e}")
            return False
            
    def close(self):
        if self.driver.service.process:
            self.driver.quit()
