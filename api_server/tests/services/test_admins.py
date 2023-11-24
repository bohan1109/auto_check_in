import unittest
from unittest.mock import AsyncMock, patch
from services.admins import AdminService
from models.admins import AdminCreate


class TestAdminService(unittest.IsolatedAsyncioTestCase):
    @patch("db.admins.AdminDB")
    def setUp(self, mock_db):
        self.admin_service = AdminService(mock_db)
        self.mock_db = mock_db

    async def test_fetch_admins(self):
        mock_admins_data = [
            {
                "_id": "some-fake-id-1",
                "account": "adminuser",
                "password": "hashedpassword",
                "username": "Admin User",
                "role": "admin",
            },
            {
                "_id": "some-fake-id-2",
                "account": "secondadmin",
                "password": "anotherhashedpassword",
                "username": "Second Admin",
                "role": "moderator",
            },
        ]
        self.mock_db.read_admin = AsyncMock(return_value=mock_admins_data)
        admins = await self.admin_service.fetch_admins()
        self.assertEqual(admins, mock_admins_data)

    async def test_fetch_admin_by_account(self):
        mock_admins_data = {
            "_id": "some-fake-id-1",
            "account": "admin_account",
            "password": "hashedpassword",
            "username": "Admin User",
            "role": "admin",
        }
        self.mock_db.read_admin_by_params = AsyncMock(return_value=mock_admins_data)
        admin = await self.admin_service.fetch_admin_by_account("admin_account")
        self.assertEqual(admin, mock_admins_data)

    async def test_fetch_admin_by_id(self):
        mock_admins_data = {
            "_id": "some-fake-id-1",
            "account": "admin_account",
            "password": "hashedpassword",
            "username": "Admin User",
            "role": "admin",
        }
        self.mock_db.read_admin_by_params = AsyncMock(return_value=mock_admins_data)
        admin = await self.admin_service.fetch_admin_by_id("id")
        self.assertEqual(admin, mock_admins_data)

    async def test_create_admin_account_exists(self):
        mock_admin = AdminCreate(
            account="existing_account",
            password="password123",
            confirm_password="password123",
            username="username",
            role="admin",
        )
        self.mock_db.read_admin_by_params = AsyncMock(return_value=True)
        with self.assertRaises(ValueError):
            await self.admin_service.create_admin(mock_admin)
            
    async def test_create_admin_account_success(self):
        mock_admin = AdminCreate(
            account="existing_account",
            password="password123",
            confirm_password="password123",
            username="username",
            role="admin",
        )
        
        self.mock_db.read_admin_by_params = AsyncMock(return_value=None)
        self.mock_db.create_admin = AsyncMock(return_value="admin_created")
        result = await self.admin_service.create_admin(mock_admin)
        self.assertEqual(result, "admin_created")


if __name__ == "__main__":
    unittest.main()
