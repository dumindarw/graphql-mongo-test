import KcAdminClient from 'keycloak-admin';
import https from 'https';

import { AUTH } from '../util/constants.util'

export const createKeycloakUser = async (user) => {

    let options = {
        baseUrl: AUTH.KEYCLOAK_BASE_URL,
        realmName: 'master',
        requestConfig: {
          method: 'post',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          httpsAgent: new https.Agent({ rejectUnauthorized: false })
        }
    }
  
    let kcAdminClient = new KcAdminClient(options);

    await kcAdminClient.auth({
      username: AUTH.KEYCLOAK_ADMIN_USERID,
      password: AUTH.KEYCLOAK_ADMIN_PW,
      grantType: 'password',
      clientId: AUTH.KEYCLOAK_ADMIN_CLIENT_ID,
      clientSecret: AUTH.KEYCLOAK_ADMIN_CLIENT_SECRET
    });

    const userToCreate = user.username;

    await kcAdminClient.users.create({
      realm: AUTH.KEYCLOAK_DEFAULT_REALM,
      username: userToCreate,
      email: user.email,
      emailVerified: true,
      enabled: true,
    });

    await kcAdminClient.setConfig({
      realmName: AUTH.KEYCLOAK_DEFAULT_REALM,
    });

    let userList = await kcAdminClient.users.findOne({ username: userToCreate });

    return await kcAdminClient.users.resetPassword({
      id: userList[0].id,
      credential: {
        temporary: false,
        type: 'password',
        value: user.password,
      },
    });

  }

  export const updateKeycloakUser = async (username, newFirstname, newLastname) => {

    let options = {
        baseUrl: AUTH.KEYCLOAK_BASE_URL,
        realmName: 'master',
        requestConfig: {
          method: 'post',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          httpsAgent: new https.Agent({ rejectUnauthorized: false })
        }
    }
  
    let kcAdminClient = new KcAdminClient(options);

    await kcAdminClient.auth({
      username: AUTH.KEYCLOAK_ADMIN_USERID,
      password: AUTH.KEYCLOAK_ADMIN_PW,
      grantType: 'password',
      clientId: AUTH.KEYCLOAK_ADMIN_CLIENT_ID,
      clientSecret: AUTH.KEYCLOAK_ADMIN_CLIENT_SECRET
    });


    await kcAdminClient.setConfig({
      realmName: AUTH.KEYCLOAK_DEFAULT_REALM,
    });

    let userList = await kcAdminClient.users.findOne({ username: username });

    return await kcAdminClient.users.update(
        {id: userList[0].id},
        {
          firstName: newFirstname,
          lastName: newLastname,
          requiredActions: ['UPDATE_PROFILE'],
          emailVerified: true,
        }
    )

  }

  export const updateKeycloakUserPassword = async (username, newPassword) => {

    let options = {
        baseUrl: AUTH.KEYCLOAK_BASE_URL,
        realmName: 'master',
        requestConfig: {
          method: 'post',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          httpsAgent: new https.Agent({ rejectUnauthorized: false })
        }
    }
  
    let kcAdminClient = new KcAdminClient(options);

    await kcAdminClient.auth({
      username: AUTH.KEYCLOAK_ADMIN_USERID,
      password: AUTH.KEYCLOAK_ADMIN_PW,
      grantType: 'password',
      clientId: AUTH.KEYCLOAK_ADMIN_CLIENT_ID,
      clientSecret: AUTH.KEYCLOAK_ADMIN_CLIENT_SECRET
    });

    await kcAdminClient.setConfig({
        realmName: AUTH.KEYCLOAK_DEFAULT_REALM,
      });

    let userList = await kcAdminClient.users.findOne({ username: username });

    return await kcAdminClient.users.resetPassword({
        id: userList[0].id,
        credential: {
          temporary: false,
          type: 'password',
          value: newPassword,
        },
      });

  }

  export const deleteKeycloakUser = async (user) => {

    let options = {
        baseUrl: AUTH.KEYCLOAK_BASE_URL,
        realmName: 'master',
        requestConfig: {
          method: 'post',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          httpsAgent: new https.Agent({ rejectUnauthorized: false })
        }
    }
  
    let kcAdminClient = new KcAdminClient(options);

    await kcAdminClient.auth({
      username: AUTH.KEYCLOAK_ADMIN_USERID,
      password: AUTH.KEYCLOAK_ADMIN_PW,
      grantType: 'password',
      clientId: AUTH.KEYCLOAK_ADMIN_CLIENT_ID,
      clientSecret: AUTH.KEYCLOAK_ADMIN_CLIENT_SECRET
    });


    await kcAdminClient.setConfig({
      realmName: AUTH.KEYCLOAK_DEFAULT_REALM,
    });

    let userList = await kcAdminClient.users.findOne({ username: user.username });

    return await kcAdminClient.users.del({ id: userList[0].id });
  }