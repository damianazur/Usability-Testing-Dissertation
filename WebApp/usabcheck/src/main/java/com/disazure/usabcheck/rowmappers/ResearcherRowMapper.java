package com.disazure.usabcheck.rowmappers;

import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;
import com.disazure.usabcheck.entity.Researcher;

public class ResearcherRowMapper implements RowMapper<Researcher> {
	@Override
    public Researcher mapRow(ResultSet rs, int rowNum) throws SQLException {

		Researcher researcher = new Researcher();
		researcher.setId(rs.getLong("researcherId"));
		researcher.setUsername(rs.getString("username"));
		researcher.setPassword(rs.getString("userPassword"));

        return researcher;

    }
}
