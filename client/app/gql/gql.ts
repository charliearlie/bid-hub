/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\n  query Categories {\n    categories {\n      id\n      title\n      description\n      createdAt\n      updatedAt\n    }\n  }\n": types.CategoriesDocument,
    "\n  query Items {\n    items {\n      id\n      name\n      description\n      imageUrl\n      seller {\n        username\n      }\n      condition\n      categories {\n        title\n      }\n      slug\n    }\n  }\n": types.ItemsDocument,
    "\n  mutation Login($emailOrUsername: String!, $password: String!) {\n    login(emailOrUsername: $emailOrUsername, password: $password) {\n      user {\n        id\n        username\n        email\n      }\n      errors {\n        field\n        message\n      }\n      success\n      token\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Register($email: String!, $password: String!, $username: String!) {\n    register(\n      userInput: { email: $email, password: $password, username: $username }\n    ) {\n      user {\n        id\n        username\n        email\n        createdAt\n      }\n      errors {\n        field\n        message\n      }\n      success\n      token\n    }\n  }\n": types.RegisterDocument,
    "\n  mutation ForgotPassword($email: String!) {\n    forgotPassword(email: $email)\n  }\n": types.ForgotPasswordDocument,
    "\n  mutation ResetPassword($newPassword: String!, $token: String!) {\n    resetPassword(newPassword: $newPassword, token: $token) {\n      success\n      user {\n        id\n      }\n      token\n    }\n  }\n": types.ResetPasswordDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Categories {\n    categories {\n      id\n      title\n      description\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query Categories {\n    categories {\n      id\n      title\n      description\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Items {\n    items {\n      id\n      name\n      description\n      imageUrl\n      seller {\n        username\n      }\n      condition\n      categories {\n        title\n      }\n      slug\n    }\n  }\n"): (typeof documents)["\n  query Items {\n    items {\n      id\n      name\n      description\n      imageUrl\n      seller {\n        username\n      }\n      condition\n      categories {\n        title\n      }\n      slug\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($emailOrUsername: String!, $password: String!) {\n    login(emailOrUsername: $emailOrUsername, password: $password) {\n      user {\n        id\n        username\n        email\n      }\n      errors {\n        field\n        message\n      }\n      success\n      token\n    }\n  }\n"): (typeof documents)["\n  mutation Login($emailOrUsername: String!, $password: String!) {\n    login(emailOrUsername: $emailOrUsername, password: $password) {\n      user {\n        id\n        username\n        email\n      }\n      errors {\n        field\n        message\n      }\n      success\n      token\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Register($email: String!, $password: String!, $username: String!) {\n    register(\n      userInput: { email: $email, password: $password, username: $username }\n    ) {\n      user {\n        id\n        username\n        email\n        createdAt\n      }\n      errors {\n        field\n        message\n      }\n      success\n      token\n    }\n  }\n"): (typeof documents)["\n  mutation Register($email: String!, $password: String!, $username: String!) {\n    register(\n      userInput: { email: $email, password: $password, username: $username }\n    ) {\n      user {\n        id\n        username\n        email\n        createdAt\n      }\n      errors {\n        field\n        message\n      }\n      success\n      token\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ForgotPassword($email: String!) {\n    forgotPassword(email: $email)\n  }\n"): (typeof documents)["\n  mutation ForgotPassword($email: String!) {\n    forgotPassword(email: $email)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ResetPassword($newPassword: String!, $token: String!) {\n    resetPassword(newPassword: $newPassword, token: $token) {\n      success\n      user {\n        id\n      }\n      token\n    }\n  }\n"): (typeof documents)["\n  mutation ResetPassword($newPassword: String!, $token: String!) {\n    resetPassword(newPassword: $newPassword, token: $token) {\n      success\n      user {\n        id\n      }\n      token\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;