

module.exports = class PermissionManager {


    /*
        constructor(permissionObject)

        Params:
            permissionObject: object of all permissions

        Returns:
            none

        Remarks:
            If permissionObject is not supplied, everyone strarts with no permissions
    */
    constructor(permissionObject) {

        if(permissionObject !== undefined)
            this.#serverPermissions = permissionObject;
    }


    /*
        getPermissions(userID)

        Params:
            userID: id of desired user

        Returns:
            object: object holding user's permissions
    */
    getPermissions(userID) {
        
        var userPermissions = this.#serverPermissions[userID];

        if (userPermissions === undefined) 
            this.setPermission(userID, 'NONE');    

        return {
            'success': true,
            'result': userPermissions
        };

    }


    /*
        hasPermissions(userID, permission)

        Params:
            userID: id of desired user
            permission: desired permission

        Returns:
            boolean: flag coresponding to user's permission

        Remarks: 
             ALL string does not apply here
    */
    hasPermissions(userID, permission) {

        var userPermissions = this.#serverPermissions[userID];

        if (userPermissions === undefined) 
            return {
                'success': true,
                'result': false
            };

        return {
            'success': true,
            'result': userPermissions[permission]
        };
    }


    /*
        setPermission(userID, permission)

        Params:
            userID: id of desired user
            permission: desired permission

        Returns:
            null: no return value

        Remarks: 
             ALL string sets all permissions to user
             null sets default permission (no permissions)
    */
    setPermission(userID, permission) {


        var userPermissions = this.#serverPermissions[userID];

        // Default: no permissions
        if(permission === null) {

            //None is only able to be set, when you have no permissions set
            if(userPermissions !== undefined)
                return {
                    'success': false,
                    'result': null
                };

            userPermissions = {
                'ADMIN': false,
                'MANAGE_TEAM': false,
            };

            return {
                'success': true,
                'result': null
            };
        
        }

        // All permissions
        else if(permission == 'ALL') {
            userPermissions = {
                'ADMIN': true,
                'MANAGE_TEAM': true
            };

            return {
                'success': true,
                'result': null
            };
        }

        if (userPermissions === undefined)
            this.setPermission(userID, null);

        userPermissions[permission] = true;
    }
    

    /*
        setPermission(userID, permission)

        Params:
            userID: id of desired user
            permission: desired permission

        Returns:
            null: no return value

        Remarks: 
             ALL string revokes all permissions to user
    */
    revokePermission(userID, permission) {

        var userPermissions = this.#serverPermissions[userID];

        if (userPermissions === undefined) 
            return {
                'success': false,
                'result': null
            }

        if (permission == 'ALL') {
            userPermissions = {
                'ADMIN': false,
                'MANAGE_TEAM': false
            };

            return {
                'success': true,
                'result': null
            };
        }

        userPermissions[permission] = false;
        return {
            'success': true,
            'result': null
        };
    }


    /*
        setPermission(userID, permission)

        Params:
           none

        Returns:
            object: object of all permissions
    */
    getPermissionsObject() {

        return {
            'success': true,
            'result': this.#serverPermissions
        }
    }

    #serverPermissions = {};


    /* Permissions
    *
    * ADMIN:                every permission below
    * MANAGE_TEAM:          create and manage teams
    * 
    * Add More
    * 
    * 
    */
}