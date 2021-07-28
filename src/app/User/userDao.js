// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT loginId, userName 
                FROM User;
                `;
  const [userRows] = await connection.query(selectUserListQuery);  //loginId, userName을 [userRows]에 넣어주는 듯?
  return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, loginId) {
  const selectUserEmailQuery = `
                SELECT loginId, userName 
                FROM User
                WHERE loginId = ?;              
                `;                    //위의 ?가 query string인듯 -> ?에 오는 loginId값이면 select 이런의미같음
  const [emailRows] = await connection.query(selectUserEmailQuery, loginId);
  return emailRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT id, loginId, userName 
                 FROM User
                 WHERE id = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO User(phoneNumber, loginId, loginPassword , userName)
        VALUES (?, ?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT loginId, userName, loginPassword
        FROM User
        WHERE loginId = ?;`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, loginId) {
  const selectUserAccountQuery = `
        SELECT status, id
        FROM User
        WHERE loginId = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      loginId
  );
  return selectUserAccountRow[0];
}

async function updateUserInfo(connection, id, userName) {
  const updateUserQuery = `
  UPDATE User
  SET userName = ?
  WHERE id = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [userName, id]);
  return updateUserRow[0];
}



async function deleteUserInfo(connection, id, status) {
  const updateUserQuery = `
  UPDATE User
  SET status = ?
  WHERE id = ?;`;
  const deleteUserRow = await connection.query(updateUserQuery, [status, id]);
  return deleteUserRow[0];
}

module.exports = {
  selectUser,
  selectUserEmail,
  selectUserId,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,
  deleteUserInfo
};
