import { DocumentNode } from 'graphql';
import rootSchema from './rootSchema';
import chatTypeDefs from '../entities/Chat/chat.typeDefs';

const combinedSchema: Array<DocumentNode> = [rootSchema, chatTypeDefs];

export default combinedSchema;
