from bcrypt import checkpw,gensalt,hashpw,kdf

class Password:
    def __init__(self,password : str) -> None :
        self.password = password.encode()
        
    def generate_salt(self):
        self.pass_salt = gensalt()
    
    def hashPassword(self)-> str :
        hash = hashpw( password = self.password ,
                    salt = self.pass_salt
                    )
        return hash.decode()
    
    @staticmethod
    def verifyPassword(password : bytes, encrypted_pass : bytes)-> bool:
        verification_status = checkpw(password,encrypted_pass)
        return verification_status
    