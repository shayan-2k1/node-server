import http from 'http';
const PORT=8000;

const users=[
    {id: 1, name: 'Shayan'},
    {id: 2, name: 'Umar'},
    {id: 3, name: 'Ali'}
];

const logger = (req, res, next)=>{
    console.log(`${req.method} ${req.url}`);
    next();
}

const jsonMiddleware=(req, res, next)=>{
    res.setHeader('Content-Type','application/json');
    next();
}

// Route Handler for GET /api/users
const getAllUserHandler=(req, res)=>{
    res.write(JSON.stringify(users));
    res.end();
}

// Route Handler for GET /api/users/:id
const getOneUserHandler=(req, res)=>{
    const id=req.url.split('/')[3];
    const user=users.find((user)=>user.id===parseInt(id));
    if(user){
        res.write(JSON.stringify(user));
    }
    else {
        res.statusCode=404;
        res.write(JSON.stringify({message: 'User not Found'}));
    }
    res.end();
}

// Route for Not Found 
const notFoundHandler=(req, res)=>{
    res.statusCode=404;
    res.write(JSON.stringify({message: 'Route not Found'}));
    res.end();
}

const server = http.createServer((req, res)=>{
    logger(req,res, ()=>{
        jsonMiddleware(req, res, ()=>{
            if(req.url==='/api/users' && req.method==='GET'){
                getAllUserHandler(req,res);
            }
            else if(req.url.match(/\/api\/users\/([0-9]+)/) && req.method==='GET')
            {
                getOneUserHandler(req, res);
            }
            else {
                notFoundHandler(req, res);
            }

        });
    });
});

server.listen(PORT, ()=>{
    console.log(`Server listening on ${PORT}`);
});