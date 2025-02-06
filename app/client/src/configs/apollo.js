import { ApolloClient, InMemoryCache } from '@apollo/client';
import { subgraphUrl } from './constants';

const client = new ApolloClient({
    uri: subgraphUrl,
    cache: new InMemoryCache(),
});

export default client;
