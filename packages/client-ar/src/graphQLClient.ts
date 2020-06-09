import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { BatchHttpLink } from "apollo-link-batch-http";
const token = localStorage.getItem("accessToken");

export default new ApolloClient({
    link: ApolloLink.from([
        onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors)
                graphQLErrors.forEach(({ message, locations, path }) =>
                    console.log(
                        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                    ),
                );
            if (networkError) console.log(`[Network error]: ${networkError}`);
        }),
        new BatchHttpLink({
            uri: process.env.NODE_ENV === "production"
                ? "https://aud-rev-test.herokuapp.com/graphql"
                : undefined,
            credentials: 'same-origin',
            headers: {
                Authorization: token ? `Bearer ${token}` : ""
            },
        })
    ]),
    cache: new InMemoryCache()
});
