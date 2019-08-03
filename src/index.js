import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import typeDefs from './schema';
import resolvers from './resolvers';
import tick from './game';

const app = express();

app.get('/tick/:game/:secret', tick);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app });

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`));
