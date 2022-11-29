import unittest

from app.data_servicing.data_verification import is_filename_allowed


class IsFileAllowed(unittest.TestCase):
    def test_empty_file_name(self):
        self.assertFalse(is_filename_allowed(''))

    def test_correct_file_name(self):
        self.assertTrue(is_filename_allowed('test.csv'))

    def test_incorrect_file_name(self):
        self.assertFalse(is_filename_allowed('test.cs'))
