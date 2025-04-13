package com.example.funlb.service;

import com.example.funlb.entity.User;
import com.example.funlb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService  implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username);
        if (user == null) {
            throw new UsernameNotFoundException("User Not Found with email: " + username);
        }
//        List<SimpleGrantedAuthority> authorities = Collections.singletonList(user.getRole())
//                .stream()
//                .map(role -> {
//                    return new SimpleGrantedAuthority(role);
//                })
//                .collect(Collectors.toList());
//        System.out.println("CustomUserDetailsService: Final authorities: " + authorities);
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                AuthorityUtils.createAuthorityList("ROLE_USER")
        );
    }
}