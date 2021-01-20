package com.disazure.usabcheck.security.services;

import java.util.Collection;
import java.util.Objects;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.disazure.usabcheck.entity.Researcher;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class UserDetailsImpl implements UserDetails {
	private static final long serialVersionUID = 1L;

	private Long researcherId;

	private String username;

	@JsonIgnore
	private String password;

	public UserDetailsImpl(Long researcherId, String username, String password) {
		this.researcherId = researcherId;
		this.username = username;
		this.password = password;
	}

	public static UserDetailsImpl build(Researcher researcher) {
		
		return new UserDetailsImpl(
				researcher.getResearcherId(), 
				researcher.getUsername(), 
				researcher.getPassword());
	}

	public Long getResearcherId() {
		return researcherId;
	}

	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public String getUsername() {
		return username;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		UserDetailsImpl user = (UserDetailsImpl) o;
		return Objects.equals(researcherId, user.researcherId);
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO Auto-generated method stub
		return null;
	}
}
