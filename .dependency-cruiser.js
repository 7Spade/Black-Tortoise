/**
 * dependency-cruiser config - enforce layer boundaries
 */
module.exports = {
    forbidden: [
        {
            name: 'domain-should-not-depend-on-outer-layers',
            comment: 'Domain must not depend on Application/Infrastructure/Presentation',
            severity: 'error',
            from: {
                path: '^src/app/domain'
            },
            to: {
                path: '^(src/app/application|src/app/infrastructure|src/app/presentation|@application|@infrastructure|@presentation)'
            }
        },
        {
            name: 'application-should-not-depend-on-presentation-or-infrastructure-impl',
            comment: 'Application should depend on Domain/interfaces only (no Presentation or concrete Infrastructure)',
            severity: 'error',
            from: {
                path: '^src/app/application'
            },
            to: {
                path: '^(src/app/presentation|@presentation|src/app/infrastructure/.+(/implementations|/impl)?)'
            }
        },
        {
            name: 'infrastructure-should-not-depend-on-presentation',
            comment: 'Infrastructure must not depend on Presentation',
            severity: 'error',
            from: {
                path: '^src/app/infrastructure'
            },
            to: {
                path: '^(src/app/presentation|@presentation)'
            }
        }
    ],
    options: {
        doNotFollow: {
            path: 'node_modules'
        }
    }
};
