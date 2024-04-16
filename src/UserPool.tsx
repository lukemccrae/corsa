import { CognitoUserPool } from 'amazon-cognito-identity-js';

// TODO: obsiously bad
const poolData = {
  UserPoolId: 'us-west-1_S7GEufYHG',
  ClientId: '15847mslbb8f3e863b5b1griuh'
};

export default new CognitoUserPool(poolData);
