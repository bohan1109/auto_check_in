from AES_config import AES_KEY
from cryptography.fernet import Fernet
class Encryption:
    def __init__(self) -> None:
        self._fernet = Fernet(AES_KEY)

    def encrypt(self, data: str) -> str:
        encrypted_data = self._fernet.encrypt(data.encode())
        return encrypted_data.decode()

    def decrypt(self, encrypted_data: str) -> str:
        decrypted_data = self._fernet.decrypt(encrypted_data.encode())
        return decrypted_data.decode()
