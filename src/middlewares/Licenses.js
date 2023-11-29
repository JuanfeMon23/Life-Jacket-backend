export function hasLicenses(licenses){
    return function(req, res, next) {
        const userLicenses = req.User.Role.Licenses.map(license => license.licenseName);
        const hasRequiredLicenses = licenses.every(license => userLicenses.includes(license));  
        if (!hasRequiredLicenses) {
          return res.status(403).send({error: { status:403, message:'Acceso denegado.'}});
        }
    
        next();
      }
}