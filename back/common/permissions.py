from rest_framework.permissions import IsAuthenticated


class IsAuthenticatedStaff(IsAuthenticated):
    """
    Central permission hook for protected ERP/POS APIs.

    Keeping this as a named class makes future role checks easy without
    changing every viewset.
    """

    pass
