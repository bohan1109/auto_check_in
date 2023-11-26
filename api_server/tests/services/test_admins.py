import unittest
from unittest.mock import AsyncMock, patch
from services.admins import AdminService
from models.admins import AdminCreate,AdminUpdate,Role
from unittest.mock import ANY

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
    
    async def test_update_admin_password(self):
        mock_admin_update = AdminUpdate(password="new_password", confirm_password="new_password")
        self.mock_db.update_admin = AsyncMock()

        await self.admin_service.update_admin("admin_id", mock_admin_update)

        self.mock_db.update_admin.assert_called_with("admin_id", {"password": ANY})
        
    async def test_update_admin_role(self):
        mock_admin_update = AdminUpdate(role=Role.ADMIN)
        self.mock_db.update_admin = AsyncMock()

        await self.admin_service.update_admin("admin_id", mock_admin_update)

        self.mock_db.update_admin.assert_called_with("admin_id", {"role": mock_admin_update.role})
        
    async def test_update_admin_username(self):
        mock_admin_update = AdminUpdate(username="new_username")
        self.mock_db.update_admin = AsyncMock()

        await self.admin_service.update_admin("admin_id", mock_admin_update)

        self.mock_db.update_admin.assert_called_with("admin_id", {"username": mock_admin_update.username})

    async def test_update_admin_multiple_fields(self):
        mock_admin_update = AdminUpdate(password="new_password", confirm_password="new_password", username="new_username")
        self.mock_db.update_admin = AsyncMock()

        await self.admin_service.update_admin("admin_id", mock_admin_update)

        self.mock_db.update_admin.assert_called_with("admin_id", {"password": ANY, "username": "new_username"})

    async def test_update_admin_no_change(self):
        mock_admin_update = AdminUpdate()
        self.mock_db.update_admin = AsyncMock()

        await self.admin_service.update_admin("admin_id", mock_admin_update)

        self.mock_db.update_admin.assert_not_called()
        
    async def test_delete_admin(self):
        mock_admin_id="admin_id"
        self.mock_db.delete_admin=AsyncMock()
        await self.admin_service.delete_admin(mock_admin_id)
        self.mock_db.delete_admin.assert_called_with(mock_admin_id)



if __name__ == "__main__":
    unittest.main()
