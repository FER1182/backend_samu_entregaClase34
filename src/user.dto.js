export class UserDTO{
    constructor({first_name,last_name,usuario,role}){
        this.firstName = first_name
        this.lastName = last_name
        this.email = usuario
        this.role = role
    }
}