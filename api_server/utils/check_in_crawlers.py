from selenium.common.exceptions import NoSuchElementException
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from config import CrawlerConfig
from selenium.common.exceptions import TimeoutException
from models.check_in_accounts import CheckInAccountCreate
from webdriver_manager.chrome import ChromeDriverManager
import time
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
class CheckInCrawler:
    def __init__(self) -> None:
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--disable-gpu')
        # URL of the Selenium server from the docker-compose setup
        selenium_url = "http://selenium:4444/wd/hub"
        
        self.driver = webdriver.Remote(
            command_executor=selenium_url,
            options=options
            )

    def check_in(self,check_in_account:dict):
        try:
            self.driver.get(CrawlerConfig.CRAWLER_WEBSITE)
            account_text_input = self.driver.find_element(By.ID, 'id')
            account_text_input.send_keys(check_in_account["check_in_account"])

            password_text_input = self.driver.find_element(By.ID, 'pw')
            password_text_input.send_keys(check_in_account["check_in_password"])

            login_button = self.driver.find_element(By.ID, 'button')
            login_button.click()
            check_in_button=self.driver.find_element(By.CSS_SELECTOR, 'div[data-key="1"]')
            check_in_button.click()
            success_element = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID,"success")))
            success_text = success_element.text
            if success_text == "success":
                return True
            else:
                return False
            # 若成功等待到元素，則回傳True
        except TimeoutException:
            logger.error("TimeoutException encountered while checking in.")
            # 若發生TimeoutException異常，表示指定元素未在預期時間內出現，則回傳False
            self.close()
            return False
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            self.close()
            return False

    
    def login_result(self,check_in_account:CheckInAccountCreate):
        try:
            self.driver.get(CrawlerConfig.CRAWLER_WEBSITE)
            account_text_input = self.driver.find_element(By.ID, 'id')
            account_text_input.send_keys(check_in_account.check_in_account)

            password_text_input = self.driver.find_element(By.ID, 'pw')
            password_text_input.send_keys(check_in_account.check_in_password)

            login_button = self.driver.find_element(By.ID, 'button')
            login_button.click()
            time.sleep(1)
            error_message = self.driver.find_element(By.ID, 'msg').text
            logger.info(f"Error message: {error_message}")
            if "帳號密碼錯誤" in error_message:
                return False

            # 等待登入成功的指標元素出現
            WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'div[data-key="1"]')))
            
            # 若成功等待到元素，則回傳True
            return True
            
        except TimeoutException:
            # 若發生TimeoutException異常，表示指定元素未在預期時間內出現，則回傳False
            logger.error("TimeoutException encountered while checking login result.")
            self.close()
            return False
        except NoSuchElementException:
            return True

        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            self.close()
            return False
            
    def close(self):
        self.driver.quit()
