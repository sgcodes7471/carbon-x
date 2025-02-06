import { gql } from '@apollo/client';

export const GET_LIST = gql`
    query GetActive($first: Int, $skip: Int) {
        listeds(first: $first,skip:$skip, orderBy:listId , orderDirection:desc) {
            id
            listId
            units
            price
            totalPrice
        }
    }
`;

export const GET_PURCHASE = gql`
    query getInactive($first: Int, $skip: Int){
        purchaseds(first: $first,skip:$skip,orderBy:listId, orderDirection:desc) {
            id
            listId
        }
    }
`