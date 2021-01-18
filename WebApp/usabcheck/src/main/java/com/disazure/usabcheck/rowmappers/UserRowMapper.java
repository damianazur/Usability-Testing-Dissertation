package com.disazure.usabcheck.rowmappers;

import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;
import com.disazure.usabcheck.models.User;

public class UserRowMapper implements RowMapper<User> {
	@Override
    public User mapRow(ResultSet rs, int rowNum) throws SQLException {

		User user = new User();
		user.setId(rs.getLong("researcherId"));
        user.setUsername(rs.getString("username"));
        user.setPassword(rs.getString("userPassword"));

        return user;

    }
}
