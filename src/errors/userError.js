export default class UserError extends Error {
    constructor(message, icon, type, caption) {
        super(message);
        this.notifyMessage = message;
        this.statusCode = 400;
        this.name = 'USER_ERROR';
        this.type = type || 'warning';
        this.icon = icon || 'warning';
        this.caption = caption;
    }
};