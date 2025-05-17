const UserLib = {
	/**
    * Validates a username based on specific criteria.
    * @param username - The username to validate.
    * @returns True if the username is valid, false otherwise.
    */
	isValidUsername: ( username: string ): boolean => {
		// Alphanumeric and underscores, 3-20 characters
		const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
		return usernameRegex.test( username );
	},

	/**
     * Validates an email address based on a regex pattern.
     * @param email - The email address to validate.
     * @returns True if the email is valid, false otherwise.
     */
	isValidEmail: ( email: string ): boolean => {
		const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
		return emailRegex.test( email );
	},

	/**
     * Validates a password based on specific criteria.
     * @param password - The password to validate.
     * @returns True if the password is valid, false otherwise.
     */
	isValidPassword: ( password: string ): boolean => {
		// At least 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		return passwordRegex.test( password );
	}
};

export default UserLib;