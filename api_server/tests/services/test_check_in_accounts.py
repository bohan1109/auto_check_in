import unittest
from unittest import mock
from unittest.mock import AsyncMock, patch
from services.check_in_accounts import CheckInAccountService
from models.check_in_accounts import CheckInAccountCreate, CheckInAccountUpdate
from unittest.mock import ANY


class TestCheckInAccountService(unittest.IsolatedAsyncioTestCase):
    @patch("db.check_in_accounts.CheckInAccountDB")
    def setUp(self, mock_db):
        self.check_in_account_service = CheckInAccountService(mock_db)
        self.mock_db = mock_db

    async def test_create_check_in_account_exists(self):
        mock_check_in_account = CheckInAccountCreate(
            check_in_account="check_in_account",
            check_in_password="check_in_password",
            check_in_username="check_in_username",
            owner="admin_account",
            check_in_time="check_in_time",
            check_out_time="check_in_account",
        )
        self.mock_db.read_check_in_account_by_params = AsyncMock(return_value=True)
        with self.assertRaises(ValueError):
            await self.check_in_account_service.create_check_in_account(
                mock_check_in_account
            )

    @patch("db.check_in_accounts.CheckInAccountDB.create_check_in_account")
    async def test_create_check_in_account_login_fail(self, mock_db_create):
        mock_check_in_account = CheckInAccountCreate(
            check_in_account="check_in_account",
            check_in_password="check_in_password",
            check_in_username="check_in_username",
            owner="admin_account",
            check_in_time="check_in_time",
            check_out_time="check_in_account",
        )
        self.mock_db.read_check_in_account_by_params = AsyncMock(return_value=False)

        with patch("utils.check_in_crawlers.CheckInCrawler") as mock_crawler_cls:
            mock_crawler = mock_crawler_cls.return_value
            mock_crawler.login_result = AsyncMock(return_value=False)

            result = await self.check_in_account_service.create_check_in_account(
                mock_check_in_account
            )
            self.assertFalse(result)
            mock_db_create.assert_not_called()

    @patch("utils.check_in_crawlers.CheckInCrawler")
    async def test_create_check_in_account_login_success(self, mock_crawler_cls):
        mock_check_in_account = CheckInAccountCreate(
            # 需改成登入帳號及密碼才能成功運行
            check_in_account="0012",
            check_in_password="N126277085",
            check_in_username="check_in_username",
            owner="admin_account",
            check_in_time="check_in_time",
            check_out_time="check_in_account",
        )

        self.mock_db.read_check_in_account_by_params = AsyncMock(return_value=False)

        mock_crawler_instance = mock_crawler_cls.return_value
        mock_crawler_instance.login_result = AsyncMock(return_value=True)
        self.mock_db.create_check_in_account = AsyncMock(
            return_value="check_in_account_created"
        )

        result = await self.check_in_account_service.create_check_in_account(
            mock_check_in_account
        )
        self.assertEqual(result, "check_in_account_created")

    async def test_update_check_in_account_existing_account_error(self):
        self.mock_db.read_check_in_account_by_params = AsyncMock(
            return_value={
                "_id": "some_other_id",
                "check_in_account": "existing_account",
            }
        )

        update_data = CheckInAccountUpdate(
            check_in_account="existing_account",
        )

        with self.assertRaises(ValueError):
            await self.check_in_account_service.update_check_in_account(
                "current_id", update_data
            )

        self.mock_db.read_check_in_account_by_params.assert_called_with(
            "check_in_account", "existing_account"
        )

    
    async def test_delete_check_in_account(self):
        mock_check_in_account_id="check_in_account_id"
        self.mock_db.delete_check_in_account=AsyncMock()
        await self.check_in_account_service.delete_check_in_account(mock_check_in_account_id)
        self.mock_db.delete_check_in_account.assert_called_with(mock_check_in_account_id)
