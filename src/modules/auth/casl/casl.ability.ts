import { AbilityBuilder, Ability } from '@casl/ability';
import { Action, Subject, UserTypes } from './casl.enum';
import { IUserTypeCreate } from 'modules/user/userTypes/types/userType.type';

// Narrowed version of the userType model (only typeName is relevant here)
type IUserTypeNameOnly = Pick<IUserTypeCreate, 'typeName'>;

// Define abilities based on user type
export function defineAbilities(userType: IUserTypeNameOnly) {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  switch (userType.typeName) {
    case UserTypes.ADMIN:
      can(Action.MANAGE, 'all');
      break;

    case UserTypes.SUB_ADMIN:
      can(Action.READ, Subject.USER);
      can(Action.UPDATE, Subject.USER);
      break;

    case UserTypes.CLIENT:
      can(Action.MANAGE, Subject.PROJECT);
      cannot(Action.MANAGE, Subject.USER_TYPE);
      break;

    case UserTypes.ACCOUNTANT:
      can(Action.READ, Subject.VENDOR_ORDER);
      can(Action.READ, Subject.PRICE_FORM);
      can(Action.APPROVE, Subject.VENDOR_ORDER);
      break;

    //     case UserTypes.ONSITE_COORDINATOR:
    //       can(Action.MANAGE, Subject.TASKASSIGNMENT);
    //       can(Action.READ, Subject.TIMELOG);
    //       break;

    //     case UserTypes.DESIGNER:
    //       can(Action.CREATE, Subject.PROJECT);
    //       can(Action.UPDATE, Subject.PROJECT);
    //       break;

    //     case UserTypes.VENDOR:
    //       can(Action.SUBMIT, Subject.PRICEFORM);
    //       can(Action.READ, Subject.VENDORCATEGORY);
    //       break;

    //     case UserTypes.SUPPLIER:
    //       can(Action.READ, Subject.VENDORORDER);
    //       can(Action.AUTHENTICATE, Subject.VENDORORDER);
    //       break;

    //     case UserTypes.WORKER:
    //       can(Action.READ, Subject.TASKASSIGNMENT);
    //       can(Action.REQUEST, Subject.IDCARD);
    //       break;

    default:
      cannot(Action.MANAGE, 'all'); // fallback: deny everything
  }

  return build();
}
