import ApolloClient from "apollo-boost";

const token = localStorage.getItem("accessToken");

export default new ApolloClient({
    headers: {
        Authorization: token ? `Bearer ${token}` : ""
    },
    uri:
        process.env.NODE_ENV === "production"
            ? "https://aud-rev-test.herokuapp.com/graphql"
            : undefined,
    clientState: {
        defaults: {},
        resolvers: {},
        typeDefs: ``
    }
});
