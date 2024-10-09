export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getImage' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ['query']),
    'saveImage' : IDL.Func([IDL.Text], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
