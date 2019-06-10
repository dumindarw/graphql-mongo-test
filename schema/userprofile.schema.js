import {
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull
} from 'graphql';

import User from '../models'
import {
  createKeycloakUser,
  deleteKeycloakUser,
  updateKeycloakUser,
  updateKeycloakUserPassword
} from '../actions/user.actions'

const CurrentaddrType = new GraphQLObjectType({
  name: "currentaddr",
  fields: {
    district: {
      type: GraphQLString
    },
    dsdivision: {
      type: GraphQLString
    }
  }
})

const CurrentaddrInputType = new GraphQLInputObjectType({
  name: 'currentaddrInput',
  fields: () => ({
    district: {
      type: GraphQLString
    },
    dsdivision: {
      type: GraphQLString
    }
  })
});

const LocationInputType = new GraphQLInputObjectType({
  name: 'locationInput',
  fields: () => ({
    type: {
      type: GraphQLString
    },
    coordinates: {
      type: new GraphQLList(GraphQLFloat)
    }
  })
});

const LocationType = new GraphQLObjectType({
  name: "location",
  fields: {
    type: {
      type: GraphQLString
    },
    coordinates: {
      type: new GraphQLList(GraphQLFloat)
    }
  }
})

const UserProfileType = new GraphQLObjectType({
  name: "UserProfile",
  fields: {
    id: {
      type: GraphQLID
    },
    username: {
      type: GraphQLString
    },
    firstname: {
      type: GraphQLString
    },
    lastname: {
      type: GraphQLString
    },
    password: {
      type: GraphQLString
    },
    nic: {
      type: GraphQLString
    },
    deviceid: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    tp: {
      type: GraphQLInt
    },
    location: {
      type: LocationType
    },
    currentaddr: {
      type: CurrentaddrType
    },
    verified: {
      type: GraphQLBoolean
    },
    blackListed: {
      type: GraphQLBoolean
    }
  }
})

const UserProfileSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      users: {
        type: GraphQLList(UserProfileType),
        resolve: async (root, args, context, info) => {

          return User.find().exec();
        }
      },
      user: {
        type: UserProfileType,
        args: {
          id: {
            type: GraphQLNonNull(GraphQLID)
          }
        },
        resolve: (root, args, context, info) => {

          //const collection = db.collection('dogs')

          return User.findById(args.id)
        }
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: {
      user: {
        /* Add user*/
        type: UserProfileType,
        args: {
          username: {
            type: GraphQLNonNull(GraphQLString)
          },
          firstname: {
            type: GraphQLNonNull(GraphQLString)
          },
          lastname: {
            type: GraphQLNonNull(GraphQLString)
          },
          password: {
            type: GraphQLNonNull(GraphQLString)
          },
          nic: {
            type: GraphQLNonNull(GraphQLString)
          },
          deviceid: {
            type: GraphQLNonNull(GraphQLString)
          },
          email: {
            type: GraphQLNonNull(GraphQLString)
          },
          tp: {
            type: GraphQLNonNull(GraphQLInt)
          },
          location: {
            type: GraphQLNonNull(LocationInputType)
          },
          currentaddr: {
            type: GraphQLNonNull(CurrentaddrInputType)
          },
          verified: {
            type: GraphQLNonNull(GraphQLBoolean)
          },
          blackListed: {
            type: GraphQLNonNull(GraphQLBoolean)
          }
        },
        resolve: async (root, args, context, info) => {

          database.collection('user').find

          let user = new User(args)
          await User.findOne({
            username: args.username
          });
          await createKeycloakUser(user);

          return await user.save();
        }
      },
      userx: {
        /* Delete user*/
        type: UserProfileType,
        args: {
          username: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: async (root, args, context, info) => {

          let user = new User(args);
          await deleteKeycloakUser(user);

          return User.findOneAndDelete({
            username: user.username
          });

        }
      },
      useru: {
        /* Update user details*/
        type: UserProfileType,
        args: {
          username: {
            type: GraphQLNonNull(GraphQLString)
          },
          firstname: {
            type: GraphQLNonNull(GraphQLString)
          },
          lastname: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: async (root, args, context, info) => {

          await updateKeycloakUser(args.username, args.firstname, args.lastname)

          let query = {
            username: args.username
          };
          return await User.findOneAndUpdate(query, {
            firstname: args.firstname,
            lastname: args.lastname
          })

        }
      },
      userupw: {
        /* Update user password*/
        type: UserProfileType,
        args: {
          username: {
            type: GraphQLNonNull(GraphQLString)
          },
          password: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: async (root, args, context, info) => {

          await updateKeycloakUserPassword(args.username, args.password)

          let query = {
            username: args.username
          };
          return await User.findOneAndUpdate(query, {
            password: args.password
          })

        }
      }
    }
  })
})

export default UserProfileSchema;