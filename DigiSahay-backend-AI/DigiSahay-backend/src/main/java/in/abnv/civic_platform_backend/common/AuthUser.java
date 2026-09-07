package in.abnv.civic_platform_backend.common;

import in.abnv.civic_platform_backend.users.entity.Role;

public interface AuthUser {
    Long getId();
    String getName();
    String getEmail();
    String getPassword();
    Role getRole();
}

