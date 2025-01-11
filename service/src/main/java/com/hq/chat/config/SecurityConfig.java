package com.hq.chat.config;

import com.hq.chat.web.filter.DefaultCORSFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.web.SecurityFilterChain;

//@Configuration
//@EnableWebSecurity
public class SecurityConfig {
    private static final Logger LOGGER = LoggerFactory.getLogger(SecurityConfig.class);

//    @Bean
    public FilterRegistrationBean<DefaultCORSFilter> corsFilter() {
        FilterRegistrationBean<DefaultCORSFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new DefaultCORSFilter());
        registrationBean.addUrlPatterns("/*");
        return registrationBean;
    }

//        @Bean
//    @Primary
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http.csrf(AbstractHttpConfigurer::disable)
//                .addFilter(new DefaultCORSFilter())
//                .authorizeHttpRequests((auth) -> {
//                    auth.requestMatchers("**/resources/**", "**/index.html", "**/swagger**", "/swagger**","**/api-docs**", "**/static/**").permitAll();
//                })
//                .authorizeHttpRequests((auth) -> auth.anyRequest().permitAll());
//                .addFilter(new BearerTokenFilter());
//                .addFilterBefore(new JwtFilter(), BeforeJwtFilter.class);
//                .addFilterBefore(new BearerTokenFilter(), BearerTokenFilter.class);
//                .addFilterAfter(new BasicAuthFilter(), BasicAuthenticationFilter.class);

        //http.addFilterBefore(new JwtFilter(), UsernamePasswordAuthenticationFilter.class);
//        return http.build();
//    }

//        @Bean
//    @Order
//    public SecurityFilterChain securityFilterChain1(HttpSecurity http) throws Exception {
//        http.csrf(AbstractHttpConfigurer::disable);
//        http.sessionManagement(httpSecuritySessionManagementConfigurer -> {
//            httpSecuritySessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
//        });
//        http.exceptionHandling(httpSecurityExceptionHandlingConfigurer -> {
//            httpSecurityExceptionHandlingConfigurer.authenticationEntryPoint((request, response, ex) -> {
//                response.sendError(
//                        HttpServletResponse.SC_UNAUTHORIZED,
//                        ex.getMessage()
//                );
//            });
//        });
////                .addFilterAfter(new BasicAuthFilter(), BasicAuthenticationFilter.class);
////        http.addFilter(new JwtAuthFilter(), BearerTokenFilter.class);
//        http.authorizeHttpRequests((auth) -> {
//            auth = auth.requestMatchers("/login", "/jwks.json", "/error", "/resources/**",
//                            "**/index.html", "/swagger-ui/**", "/api-docs/**", "/static/**")
//                    .permitAll();
//            auth.requestMatchers("/actuator/health", "actuator/info").permitAll();
//
//            auth = auth.requestMatchers("/building/**", "/floor/**", "/parking/**", "/users/**", "/vehicle/**")
//                    .authenticated();
//            auth.anyRequest().authenticated();
//        });
//
//        return http.build();
//    }
//
//    private <T> T getContext(HttpSecurity http, Class<T> clazz) {
//        return http.getSharedObject(clazz);
//    }

}

