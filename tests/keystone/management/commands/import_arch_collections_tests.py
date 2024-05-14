import pytest

from keystone.management.commands.import_arch_collections import normalize_arch_id


def test_normalize_arch_id():
    """Any embedded user ID is removed from the arch_id for AIT and SPECIAL-type collections
    but CUSTOM-type collection IDs are left untouched."""
    for a, b in (
        ("ARCHIVEIT-ks:test:00001", "ARCHIVEIT-00001"),
        ("ARCHIVEIT-00001", "ARCHIVEIT-00001"),
        ("SPECIAL-ks:test:test-collection", "SPECIAL-test-collection"),
        ("SPECIAL-test-collection", "SPECIAL-test-collection"),
        ("CUSTOM-ks:test:custom-collection", "CUSTOM-ks:test:custom-collection"),
    ):
        assert normalize_arch_id(a) == b

    with pytest.raises(AssertionError):
        normalize_arch_id("ARCHIVEIT-")
