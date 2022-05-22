/**
 * @description 参数必填+选填
 */
type DBParameter<P, K1, K2> = Pick<P, K1> & Pick<Partial<P>, K2>;

/**
 * @description 参数选填
 */
type DBParameterPartial<P, K> = Pick<Partial<P>, K>;
