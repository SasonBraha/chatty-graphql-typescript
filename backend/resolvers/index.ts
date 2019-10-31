import ChatResolver from './Chat/Chat.resolver';
import AuthResolver from './Auth/Auth.resolver';
import UserResolver from './User/User.resolver';
import SharedResolvers from './SharedResolvers';

export default [ChatResolver, AuthResolver, UserResolver, ...SharedResolvers];
