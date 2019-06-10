import express from "express"
import path  from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import ExpressGraphQL from 'express-graphql';


const port = process.env.PORT || 3000

import UserProfileSchema from './schema/userprofile.schema'

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, 'public')));


app.use("/graphql", ExpressGraphQL({
  schema: UserProfileSchema,
  graphiql: true
}))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

