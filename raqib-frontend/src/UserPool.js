import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-1_sr2N8phGX',
  ClientId: '7plav5ppokas3cp4mh3casdikp'
};

export default new CognitoUserPool(poolData);