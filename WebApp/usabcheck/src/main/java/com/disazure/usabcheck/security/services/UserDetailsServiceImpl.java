package com.disazure.usabcheck.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.disazure.usabcheck.entity.Researcher;
//import com.bezkoder.springjwt.repository.UserRepository;
import com.disazure.usabcheck.dao.ResearcherDao;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
	@Autowired
	ResearcherDao researcherDao;

	@Override
	@Transactional
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Researcher researcher = researcherDao.findByUsername(username);
				
		if (researcher == null) {
			throw new UsernameNotFoundException("Researcher Not Found with username: " + username);
		}

		return UserDetailsImpl.build(researcher);
	}

}
