import { gql, ApolloServer } from 'apollo-server';
import StarWarsApi from './datasources/starwars';
const typeDefs = gql`
  type People {
    name: String!
  }
  type Film {
    title: String!
    episode_id: Int!
    director: String!
    producer: String!
    fullTitle: String!

    characters: [People!]!
  }

  type Query {
    hello: String
    films: [Film!]!
  }
`;
const resolvers = {
  Film: {
    characters: async (source, _args, { dataSources }) => {
      const promises = source.characters.map(url => {
        const splitString = url.split('/');
        console.log('FETCHING', splitString[splitString.length - 2]);
        return dataSources.starWarsApi.getPeople(
          splitString[splitString.length - 2]
        );
      });
      return Promise.all(promises);
    },
    fullTitle: (source, _args, { _dataSources }) => {
      return `Episode ${source.episode_id} - ${source.title}`;
    }
  },
  Query: {
    hello: () => 'world',

    films: async (_source, _args, { dataSources }) => {
      return await dataSources.starWarsApi.getFilms();
    }
  }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      starWarsApi: new StarWarsApi()
    };
  }
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
