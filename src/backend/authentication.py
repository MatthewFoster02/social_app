import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext
from datetime import datetime, timedelta
from decouple import config

class Authorization():
    security = HTTPBearer()
    password_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
    SECRET = config('SECRET_KEY', cast=str) # Take secret key from environment variables.

    def hashPassword(self, password):
        return self.password_context.hash(password)
    
    def verifyPassword(self, plainPassword, hashedPassword):
        return self.password_context.verify(plainPassword, hashedPassword)
    
    def encodeToken(self, userID):
        payload = {
            'exp': datetime.utcnow() + timedelta(days=1), # Token valid for 24 hours (1 day)
            'iat': datetime.utcnow(),
            'sub': userID
        }
        return jwt.encode(payload, self.SECRET, algorithm='HS256')
    
    def decodeToken(self, token):
        try:
            payload = jwt.decode(token, self.SECRET, algorithms=['HS256'])
            return payload['sub']
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail='Signature has expired')
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail='Invalid token')
    
    def authWrapper(self, auth:HTTPAuthorizationCredentials=Security(security)):
        return self.decodeToken(auth.credentials)
