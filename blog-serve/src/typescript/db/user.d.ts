import User from "../../db/modles/User";
type UserAttributes = "status";

type GetUser = (
    where: Pick<User, "userId">,
    attributes?: Array<UserAttributes>
) => Promise<User | null>;

type CreateUser = (data: Pick<User, "userId" | "ip">) => Promise<User>;
