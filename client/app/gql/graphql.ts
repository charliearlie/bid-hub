/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Address = {
  __typename?: 'Address';
  addressName: Scalars['String'];
  cityOrTown: Scalars['String'];
  firstLine: Scalars['String'];
  id: Scalars['ID'];
  postCode: Scalars['String'];
  secondLine?: Maybe<Scalars['String']>;
  thirdLine?: Maybe<Scalars['String']>;
  user: User;
};

export type Bid = {
  __typename?: 'Bid';
  amount: Scalars['Float'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  item: Item;
  status: Scalars['String'];
  updatedAt: Scalars['String'];
  user: User;
};

export type BidResponse = {
  __typename?: 'BidResponse';
  bid?: Maybe<Bid>;
  errors?: Maybe<Array<ResolverError>>;
  success: Scalars['Boolean'];
};

export type Category = {
  __typename?: 'Category';
  createdAt: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type CategoryValidator = {
  description?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type EditUserValidator = {
  avatarUrl?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export type Item = {
  __typename?: 'Item';
  bids: Array<Bid>;
  buyItNowPrice?: Maybe<Scalars['Float']>;
  categories: Array<Category>;
  condition: Scalars['String'];
  createdAt: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  formattedBuyItNowPrice: Scalars['String'];
  formattedStartingPrice: Scalars['String'];
  formattedWinningBid: Scalars['String'];
  hasBiddingEnabled: Scalars['Boolean'];
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  seller: User;
  slug: Scalars['String'];
  startingPrice?: Maybe<Scalars['Float']>;
  updatedAt: Scalars['String'];
  winningBid?: Maybe<Scalars['Float']>;
};

export type ItemResponse = {
  __typename?: 'ItemResponse';
  errors?: Maybe<Array<ResolverError>>;
  item?: Maybe<Item>;
  success: Scalars['Boolean'];
};

export type ItemValidator = {
  categories?: InputMaybe<Array<Scalars['ID']>>;
  condition: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  price: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addAddress: UserResponse;
  addCategory: Category;
  addItem: ItemResponse;
  addPaymentMethod: UserResponse;
  deleteCategory: Scalars['Boolean'];
  deleteItem: Scalars['Boolean'];
  editItem: Item;
  editUser: UserResponse;
  emailMagicLink: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  handleMagicEmailLogin: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  placeBid: BidResponse;
  register: UserResponse;
  resetPassword: UserResponse;
};


export type MutationAddAddressArgs = {
  addressLine1: Scalars['String'];
  addressLine2: Scalars['String'];
  city: Scalars['String'];
  postCode: Scalars['String'];
};


export type MutationAddCategoryArgs = {
  categoryInput: CategoryValidator;
};


export type MutationAddItemArgs = {
  itemInput: ItemValidator;
  userId: Scalars['Float'];
};


export type MutationAddPaymentMethodArgs = {
  cardDetails: PaymentMethodValidator;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteItemArgs = {
  id: Scalars['ID'];
};


export type MutationEditItemArgs = {
  id: Scalars['ID'];
  itemInput: ItemValidator;
};


export type MutationEditUserArgs = {
  editedUserDetails: EditUserValidator;
};


export type MutationEmailMagicLinkArgs = {
  email: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationHandleMagicEmailLoginArgs = {
  loginToken: Scalars['String'];
};


export type MutationLoginArgs = {
  emailOrUsername: Scalars['String'];
  password: Scalars['String'];
};


export type MutationPlaceBidArgs = {
  amount: Scalars['Float'];
  itemId: Scalars['Float'];
};


export type MutationRegisterArgs = {
  userInput: UserValidator;
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};

export type PaymentMethod = {
  __typename?: 'PaymentMethod';
  billingAddress: Address;
  cardName: Scalars['String'];
  cardNumber: Scalars['String'];
  createdAt: Scalars['String'];
  expiryDate: Scalars['String'];
  id: Scalars['ID'];
  lastFourDigits: Scalars['String'];
  type: Scalars['String'];
  updatedAt: Scalars['String'];
  user: User;
};

export type PaymentMethodValidator = {
  cardName: Scalars['String'];
  cardNumber: Scalars['String'];
  expiryDate: Scalars['String'];
  type: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  bids: Array<Bid>;
  categories: Array<Category>;
  getCatgoryById: Category;
  getItemById: ItemResponse;
  getUsers: Array<User>;
  items: Array<Item>;
  me: UserResponse;
  searchItems: Array<Item>;
};


export type QueryGetCatgoryByIdArgs = {
  id: Scalars['Float'];
};


export type QueryGetItemByIdArgs = {
  id: Scalars['Float'];
};


export type QuerySearchItemsArgs = {
  searchQuery: Scalars['String'];
};

export type ResolverError = {
  __typename?: 'ResolverError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  active: Scalars['String'];
  addresses: Array<Address>;
  avatarUrl?: Maybe<Scalars['String']>;
  bids: Array<Bid>;
  createdAt: Scalars['String'];
  email: Scalars['String'];
  feedback: Array<UserReview>;
  feedbackGiven: Array<UserReview>;
  feedbackScore: Scalars['Float'];
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  itemsForSale: Array<Item>;
  lastName?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  paymentCards: Array<PaymentMethod>;
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<ResolverError>>;
  success: Scalars['Boolean'];
  token?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type UserReview = {
  __typename?: 'UserReview';
  createdAt: Scalars['String'];
  feedback: Scalars['String'];
  id: Scalars['ID'];
  reviewedUser: User;
  reviewer: User;
  updatedAt: Scalars['String'];
};

export type UserValidator = {
  avatarUrl?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
  username: Scalars['String'];
};

export type CategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: string, title: string, description?: string | null, createdAt: string, updatedAt: string }> };

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', success: boolean, token?: string | null, user?: { __typename?: 'User', id: string, username: string, email: string, createdAt: string } | null, errors?: Array<{ __typename?: 'ResolverError', field: string, message: string }> | null } };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type ResetPasswordMutationVariables = Exact<{
  newPassword: Scalars['String'];
  token: Scalars['String'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'UserResponse', success: boolean, token?: string | null, user?: { __typename?: 'User', id: string } | null } };


export const CategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CategoriesQuery, CategoriesQueryVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userInput"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const ForgotPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ForgotPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"forgotPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const ResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;