import hashlib
from django.contrib.auth.hashers import PBKDF2PasswordHasher
from django.utils.crypto import constant_time_compare


class PBKDF2WrappedSha1PasswordHasher(PBKDF2PasswordHasher):
    """PBKDF2 wrapped sha1 password hasher"""

    algorithm = "pbkdf2_sha1"

    def encode_sha1_hash(self, sha1_hash, salt=None, iterations=None):
        """Encode sha1_hash using PBKDF2PasswordHasher"""
        if not salt:
            salt = self.salt()
        return super().encode(sha1_hash, salt, iterations)

    def create_sha1_hash_and_encode(self, password, salt, iterations=None):
        """Create sha1_hash from password string and encode using PBKDF2PasswordHasher"""
        encoded_string = password.encode()
        sha1_hash = hashlib.sha1(encoded_string).hexdigest()
        return self.encode_sha1_hash(sha1_hash, salt, iterations)

    def verify(self, password, encoded):
        """Create sha1 hash from password string, encode using PBKDF2PasswordHasher,
        and compare this with encoded"""
        algorithm, _iterations, salt, _sha1_hash = encoded.split("$", 3)
        if algorithm != self.algorithm:
            raise AssertionError
        encoded_input = self.create_sha1_hash_and_encode(password, salt)
        return constant_time_compare(encoded_input, encoded)
