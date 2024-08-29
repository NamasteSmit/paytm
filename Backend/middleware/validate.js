const validate = (Schema) => async(req,res,next)=>{

    try {
        const parse = await Schema.parseAsync(req.body);

        console.log("parse" ,parse);
   
        req.body = parse;
   
        next();
    }catch(err){
        return res.stauts(400).json(
            {
                error: err
            }
        )
    }



     
}

module.exports = validate;