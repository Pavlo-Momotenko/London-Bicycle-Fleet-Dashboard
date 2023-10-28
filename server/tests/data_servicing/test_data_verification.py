from unittest import TestCase

from src.utils.file import FileUtils


class FileUtilsCase(TestCase):
    def test_empty_file_name(self):
        self.assertFalse(FileUtils.is_filename_allowed(''))

    def test_correct_file_name(self):
        self.assertTrue(FileUtils.is_filename_allowed('test.csv'))

    def test_incorrect_file_name(self):
        self.assertFalse(FileUtils.is_filename_allowed('test.cs'))
