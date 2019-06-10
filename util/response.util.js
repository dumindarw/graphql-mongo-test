class Response {

    /*
    {
        "status": "ok",
        "code": 200,
        "messages": [],
        "result": {
            "user": {
                "id": 123,
                "name": "shazow"
            }
        }
    }
    */

    constructor(status, code, messages = [], result={}){
        this.status = status;
        this.code = code;
        this.messages = messages;
        this.result = result;
    }

}

export default Response;