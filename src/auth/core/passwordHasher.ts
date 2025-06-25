import bcrypt from "bcrypt"

const saltRounds = 10

export function hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, function(err: any, salt: string) {
        bcrypt.hash(password, salt, function(err: any, hash: string) {
                if (err) reject(err)

                resolve(hash.normalize())
            });
        });
    })
}

export function comparePassword(inputPassword: string, hashedPassword: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(inputPassword, hashedPassword, function(err: any, result: boolean) {
      if (err) reject(err)
      resolve(result)
    });
  })
}
