const Ajv = require("ajv");
const ajv = new Ajv()
    .addFormat("email", /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)
    .addFormat("password", /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/);

const AppError = require("./appError");

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const convertInstancePath = (errObj) => capitalizeFirstLetter(errObj.instancePath.split('/')[1]);


exports.validateBody = (body, schema) => {
    const validate = ajv.compile(schema);
    const valid = validate(body);
    const statusCode = 400;
    if(valid) return true;
    
    console.log(valid, validate.errors);
    const err = validate.errors[0];

    if(err.keyword == 'additionalProperties') {
        throw new AppError(`Body ${err.message} i.e ${err.params.additionalProperty}`, statusCode);

    } else if(err.keyword == 'type') {
        throw new AppError(`${convertInstancePath(err)} ${err.message}`, statusCode);

    } else if(err.keyword == 'required') {
        throw new AppError(`Body ${err.message}`, statusCode);

    } else if(err.keyword == 'format') {
        if(err.params.format == 'password') {
            throw new AppError("Password must include minimum 8 letter, with at least a symbol, upper and lower case letters and a number", statusCode);

        } else if(err.params.format == 'email') {
            throw new AppError(`Please provide valid email address`, statusCode);
        }
    } else {
        throw new AppError(err.message);
    }

};
